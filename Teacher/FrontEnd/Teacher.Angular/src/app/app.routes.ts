import { Routes } from '@angular/router';
import {Examlist} from './components/common/examlist/examlist';
import {QuestionEdit} from './components/write/questionEdit/questionEdit';

export const routes: Routes = [
  {
    path: '',
    component: Examlist,
    title: 'ExamList',
  },
  {
    path: 'exam/:examId/addQuestion',
    component: QuestionEdit,
    title: 'QuestionAdd',
  },
  {
    path: 'exam/:examId/editQuestion/:questionId',
    component: QuestionEdit,
    title: 'QuestionEdit',
  }
];
