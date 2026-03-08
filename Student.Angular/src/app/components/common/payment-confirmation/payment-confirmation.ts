import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PaymentConfirmationSubmission } from '../../../types';

@Component({
  selector: 'app-payment-confirmation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    @if (visible) {
      <div
        class="fixed inset-0 flex items-center justify-center bg-teal-600/80 z-50"
      >
        <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
          <form [formGroup]="form" (ngSubmit)="onConfirm()" class="space-y-4">
            <div id="card-element" #cardElement></div>
            @if (cardErrors) {
              <div class="text-red-600 text-sm">{{ cardErrors }}</div>
            }

            OR

            <input
              id="codeEd"
              type="text"
              name="code"
              required
              formControlName="code"
              placeholder="Code"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (errorMessage && form.pristine) {
              <div id="confirm-err-mes" class="text-red-600 text-sm">
                {{ errorMessage }}
              </div>
            }

            <div class="flex justify-end gap-3">
              <button type="button" (click)="onCancel()" class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button
                id="submitCodeButton"
                type="submit"
                [disabled]="form.invalid&&formDisabled"
                class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class PaymentConfirmation implements OnChanges, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef<HTMLDivElement>;
  form: FormGroup;
  @Input() visible = false;
  @Input() code: string | null | undefined = null;
  @Input() publishableKey: string | null | undefined = null;
  @Input() errorMessage: string | null | undefined = null
  @Output() confirmed = new EventEmitter<PaymentConfirmationSubmission>();
  @Output() cancel = new EventEmitter<boolean>();

  stripe: Stripe | null = null;
  card!: StripeCardElement;
  cardErrors: string | null = null;
  loading = false;
  cardComplete = false;
  formDisabled = true;
  token: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ['', Validators.required],
    });
  }

  showCard() {
    if (this.cardElement && this.card) {
      setTimeout(() => {
        this.card.mount(this.cardElement.nativeElement);
      })
    }
  }

  ngOnDestroy(): void {
    if (this.card) {
      this.card.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] && this.code) {
      this.form.patchValue({ code: this.code });
      this.form.markAsPristine();
    }
    setTimeout(async () => {
      if (this.publishableKey) {
        this.stripe = await loadStripe(this.publishableKey!)
        if (!this.stripe) {
          console.error('Stripe.js has not loaded');
          return;
        }
        const elements = this.stripe.elements();
        this.card = elements.create('card');
        this.card.on('change', (ev) => {
          this.cardErrors = ev.error ? ev.error.message : null;
          this.cardComplete = ev.complete;
          this.formDisabled = !(this.cardComplete);
          this.errorMessage = null;
        })
        this.showCard()
      }
    })
  }

  async onConfirm() {
    const endRes = {} as PaymentConfirmationSubmission;
    if (!this.formDisabled) {
      if (!this.stripe || !this.card) {
        console.error('Stripe.js has not loaded', this.stripe, this.card);
        return;
      }
      this.formDisabled = true; // disable submit button on submit
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
      });

      if (error) {
        this.cardErrors = error?.message || null;
      } else {
        const { id } = paymentMethod!
        endRes.PaymentMethodId = id;
      }
    } else if (this.form.valid) {
      endRes.AccessCode = this.form.value.code;
    } else {
      return;
    }

    this.confirmed.emit(endRes);
    this.form.setValue({ code: '' })
    this.card.destroy();
    this.onCancel()
  }

  onCancel() {
    this.cancel.emit(true);
  }
}
