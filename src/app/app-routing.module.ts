import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RoomComponent } from './pages/room/room.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'room', component: RoomComponent },
  { path: '**', component: NotFoundComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
