import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMusicDialogComponent } from './user-music-dialog.component';

describe('UserMusicDialogComponent', () => {
  let component: UserMusicDialogComponent;
  let fixture: ComponentFixture<UserMusicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMusicDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMusicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
