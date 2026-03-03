import { Routes } from '@angular/router';
import {Question} from "./components/common/question/question";
import {MainView} from './components/common/main-view/main-view';

export const routes: Routes = [
    {
        path: '',
        component: MainView,
        title: 'MainView'
    },
    {
        path: ':submissionId/question/:questionId',
        component: Question,
        title: 'Question',
    }
];
