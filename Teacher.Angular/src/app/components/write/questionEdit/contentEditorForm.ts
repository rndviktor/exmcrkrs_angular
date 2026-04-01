import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import {
  LucideAngularModule,
} from 'lucide-angular';
import {Writer} from '../../../services/writer';

@Component({
  selector: 'app-content-editor-form',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col border rounded-md">
      <div class="flex items-center gap-1 border-b p-1 rounded-t-md">

        @if (!isEditing()) {
          <button id="contentEdit"  (click)="toggleEdit(true)" class="p-1">
            <lucide-icon name="edit" [size]="12"></lucide-icon>
          </button>
        }

        @if (isEditing()) {
          <div class="flex items-center gap-1 border-r px-5">
            <button (click)="editor()?.chain()?.focus()?.toggleBold()?.run()"
                    [className]="'p-2 rounded ' + isActive('bold')">
              <lucide-icon name="bold" [size]="10"></lucide-icon>
            </button>
            <button (click)="editor()?.chain()?.focus()?.toggleItalic()?.run()"
                    [className]="'p-2 rounded ' + isActive('italic')">
              <lucide-icon name="italic" [size]="10"></lucide-icon>
            </button>
            <button (click)="editor()?.chain()?.focus()?.toggleUnderline()?.run()"
                    [className]="'p-2 rounded ' + isActive('underline')">
              <lucide-icon name="underline" [size]="10"></lucide-icon>
            </button>
          </div>

          <div class="flex items-center gap-1 border-r px-5">
            <button (click)="editor()?.chain()?.focus()?.setTextAlign('left')?.run()"
                    [className]="'p-2 rounded ' + isActive('textAlign', { textAlign: 'left' })">
              <lucide-icon name="align-left" [size]="10"></lucide-icon>
            </button>

            <button (click)="editor()?.chain()?.focus()?.setTextAlign('center')?.run()"
                    [className]="'p-2 rounded ' + isActive('textAlign', { textAlign: 'center' })">
              <lucide-icon name="align-center" [size]="10"></lucide-icon>
            </button>

            <button (click)="editor()?.chain()?.focus()?.setTextAlign('right')?.run()"
                    [className]="'p-2 rounded ' + isActive('textAlign', { textAlign: 'right' })">
              <lucide-icon name="align-right" [size]="10"></lucide-icon>
            </button>
          </div>

          <div class="flex items-center gap-1 px-5">
            <button id="questionContentSubmit" (click)="handleSubmit()" class="text-green-400 p-1">
              <lucide-icon name="check" [size]="12"></lucide-icon>
            </button>
            <button (click)="toggleEdit(false)" class="text-red-400 p-1">
              <lucide-icon name="x-circle" [size]="12"></lucide-icon>
            </button>
          </div>
        }
      </div>

      <div #editorContainer
           class="whitespace-pre-line border-b-2 border-t-4 border-t-cyan-600 flex-1 min-h-[150px] bg-white"></div>
    </div>`
})
export class ContentEditorFormComponent implements OnDestroy, AfterViewInit {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) examId!: string;
  @Input() content: string | null | undefined = null;
  @Input() createNew = false;
  @Output() onSubmit = new EventEmitter<string>();

  // Signals for state management
  public editor = signal<Editor | null>(null);
  public isEditing = signal(false);

  constructor(private writer: Writer) {
    // Sync content when input changes
    effect(() => {
      const currentEditor = this.editor();
      if (currentEditor && this.content !== currentEditor.getHTML()) {
        currentEditor.commands.setContent(this.content || '');
      }
    });
  }

  ngAfterViewInit() {
    const editorInstance = new Editor({
      element: this.editorContainer.nativeElement,
      extensions: [
        StarterKit,
        Highlight,
        Image.configure({ inline: true }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
      ],
      editable: this.createNew,
      editorProps: {
        handleDrop: (view, event, _, moved) => {
          if (!moved && event.dataTransfer?.files[0]) {
            const file = event.dataTransfer.files[0];
            if (/image/i.test(file.type)) {
              this.uploadImage(file, view);
              return true;
            }
          }
          return false;
        },
        handlePaste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          for (const item of items) {
            if (item.type.indexOf('image') === 0) {
              const file = item.getAsFile();
              if (file) {
                this.uploadImage(file, view);
                return true;
              }
            }
          }
          return false;
        }
      },
      onUpdate: () => {
        // Triggering a signal update ensures UI buttons (isActive) refresh
        this.editor.set(editorInstance);
      },
      onSelectionUpdate: () => {
        this.editor.set(editorInstance);
      }
    });

    this.editor.set(editorInstance);
    this.isEditing.set(this.createNew);
    console.log('---x', this.isEditing());
  }

  async uploadImage(file: File, view: any) {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("ExamId", this.examId);

    try {
      const url = await this.writer.postImage(formData);

      if (url) {
        const node = view.state.schema.nodes.image.create({ src: url });
        const transaction = view.state.tr.replaceSelectionWith(node);
        view.dispatch(transaction);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  }

  toggleEdit(value: boolean) {
    const ed = this.editor();
    if (!ed) return;

    if (this.isEditing() && !value) {
      ed.commands.setContent(this.content || '');
    }
    this.isEditing.set(value);
    ed.setEditable(value);
  }

  handleSubmit() {
    const ed = this.editor();
    if (ed) {
      this.onSubmit.emit(ed.getHTML());
      this.isEditing.set(false);
      ed.setEditable(false);
    }
  }

  isActive(name: string, attrs?: any): string {
    return this.editor()?.isActive(name, attrs)
      ? 'bg-gray-700 text-cyan-400'
      : 'text-gray-600 hover:bg-gray-700';
  }

  ngOnDestroy() {
    this.editor()?.destroy();
  }
}
