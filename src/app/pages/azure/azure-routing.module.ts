import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AzurePage } from './azure.page';

const routes: Routes = [
  {
    path: '',
    component: AzurePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AzurePageRoutingModule {}
