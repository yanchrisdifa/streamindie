import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { SongsService } from 'src/app/core/services/songs.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPlayingSong: any = null;
  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  constructor(
    private songsService: SongsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getCurrentPlayingSong();
    this.cdr.detectChanges();
  }

  getCurrentPlayingSong(): void {
    let oldPlayingSongId: string = null;
    console.log('oldplayingsong', oldPlayingSongId);
    this.songsService.currentPlayingSong$.subscribe((data) => {
      if (data) {
        if (this.audioPlayer) {
          this.currentPlayingSong = data;
          console.log('test', this.currentPlayingSong);
          if (oldPlayingSongId === this.currentPlayingSong.id) {
            if (!this.currentPlayingSong?.isPlayed) {
              console.log('true', this.currentPlayingSong.isPlayed);
              this.audioPlayer.nativeElement.pause();
            } else {
              console.log('false', this.currentPlayingSong.isPlayed);
              this.audioPlayer.nativeElement.play();
            }
          } else {
            console.log('kalo gitu masuk sini');
            this.audioPlayer.nativeElement.load();
            this.audioPlayer.nativeElement.play();
          }
          oldPlayingSongId = data?.id;
        }
      } else {
        this.currentPlayingSong = null;
        oldPlayingSongId = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (
      this.currentPlayingSong?.id &&
      this.currentPlayingSong?.isPlayed === true
    ) {
      this.currentPlayingSong = {
        ...this.currentPlayingSong,
        isPlayed: false,
      };
      this.songsService.oldPlayingSongId = this.currentPlayingSong?.id;
      this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
    }
  }
}
