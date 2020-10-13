import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections.service';
import { Favourites } from './models/favourites';


@Component({
  templateUrl: "./favourites.component.html",
  styleUrls: ["./favourites.component.scss"],
})
export class FavouritesComponent implements OnInit {
  initError = false;
  loading = false;
  collection$?: Observable<Favourites>;
  constructor(private collectionsService: CollectionsService){}
  ngOnInit(): void {
    this.collection$ = this.collectionsService.getFavourites();
    
  }
}