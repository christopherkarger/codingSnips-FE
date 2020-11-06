import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FavouritesComponent } from "./favourites.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { ChildRoutesGuardService } from 'src/app/services/child-routes-guard.service';

const routes: Routes = [
  {
    path: "",
    component: FavouritesComponent,
    children: [
      {
        path: ":id",
        canActivate: [ChildRoutesGuardService],
        loadChildren: () =>
          import("../snip/snip.module").then((m) => m.SnipModule),
      },
    ]
  },
];

@NgModule({
  declarations: [FavouritesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [],
})
export class FavouritesModule {}
