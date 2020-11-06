import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./modules/app-routing.module";
import { AppComponent } from "./app.component";
import { GraphQLModule } from "./modules/graphql.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { SharedComponentsModule } from "./shared/shared-components.module";
import { TooltipModule } from "./components/tooltip/tooltip.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SharedComponentsModule,
    TooltipModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import("highlight.js"),
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
