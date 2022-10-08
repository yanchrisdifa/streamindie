import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMusicComponent } from './user-music.component';

describe('UserMusicComponent', () => {
  let component: UserMusicComponent;
  let fixture: ComponentFixture<UserMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMusicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
