import { Routes } from '@angular/router';
import {Examlist} from './components/read/examlist/examlist';
import {QuestionEdit} from './components/write/questionEdit/questionEdit';

export const routes: Routes = [
  {
    path: '',
    component: Examlist,
    title: 'ExamList',
  },
  {
    path: 'addQuestion',
    component: QuestionEdit,
    title: 'QuestionEdit',
  }
];
