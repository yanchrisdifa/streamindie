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
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, of } from 'rxjs';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPlayingSong: any = null;
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('songRange') songRange: ElementRef;
  @ViewChild('volumeRange') volumeRange: ElementRef;
  private subs = new SubSink();
  currentPlayingSongDuration: string;
  songProgress: number = 0;
  songCurrentTime: string = '0:00';
  currentPlayingGenre: any;
  songCtrl: FormControl<number> = new FormControl(0);
  volumeCtrl: FormControl<number> = new FormControl(0);

  playBackMode = {
    repeatOne: false,
    shuffle: false,
  };

  constructor(
    private songsService: SongsService,
    private cdr: ChangeDetectorRef,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getCurrentPlayingSong();
    this.getCurrentTime();
    this.getCurrentPlayingGenre();
    this.subsFormControlsVal();
    this.cdr.detectChanges();
  }

  subsFormControlsVal() {
    this.subs.sink = this.volumeCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((resp) => {
        if (this.audioPlayer?.nativeElement) {
          this.audioPlayer.nativeElement.volume = resp / 100;
          this.volumeRange.nativeElement.style.backgroundSize =
            ((resp - 0) * 100) / (100 - 0) + '% 100%';
        }
      });
    this.volumeCtrl.setValue(80);

    this.subs.sink = this.songCtrl.valueChanges.subscribe((resp) => {
      if (this.audioPlayer?.nativeElement?.currentTime) {
        const songDuration: number = this.audioPlayer.nativeElement.duration;
        const songClickedDuration: number = (songDuration * resp) / 100;
        this.audioPlayer.nativeElement.currentTime = songClickedDuration;
      }
    });
    this.songCtrl.setValue(0);
  }

  toggleVolume() {
    if (this.volumeCtrl.value) {
      this.volumeCtrl.setValue(0);
    } else {
      this.volumeCtrl.setValue(80);
    }
  }

  getCurrentPlayingSong(): void {
    let oldPlayingSongId: string = JSON.parse(
      localStorage.getItem('currentPlayingSong')
    )?.id;
    let isPageReloaded =
      window.performance.getEntriesByType('navigation')[0]['type'] === 'reload'
        ? true
        : false;
    this.subs.sink = this.songsService.currentPlayingSong$.subscribe((data) => {
      if (data) {
        if (this.audioPlayer) {
          this.currentPlayingSong = data;
          if (isPageReloaded && !oldPlayingSongId) {
            isPageReloaded = false;
          }
          if (!isPageReloaded) {
            if (oldPlayingSongId === this.currentPlayingSong.id) {
              if (!this.currentPlayingSong?.isPlayed) {
                this.audioPlayer.nativeElement.pause();
              } else {
                this.audioPlayer.nativeElement.play();
              }
            } else {
              this.audioPlayer.nativeElement.load();
              this.audioPlayer.nativeElement.play();
            }
            oldPlayingSongId = data?.id;
          } else {
            isPageReloaded = false;
            if (
              this.currentPlayingSong?.id &&
              this.currentPlayingSong?.isPlayed === true
            ) {
              this.songsService.oldPlayingSongId = this.currentPlayingSong?.id;
              this.songsService.rawCurrentPlayingSong = this.currentPlayingSong;
              this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
            }
          }
        }
      } else {
        this.currentPlayingSong = null;
        oldPlayingSongId = null;
      }
    });
  }

  setCurrentPlayingSong(songData: any) {
    if (songData) {
      if (this.currentPlayingGenre?.id) {
        this.genresService.setCurrentPlayingGenre(this.currentPlayingGenre);
      }
      this.songsService.setCurrentPlayingSong(songData);
    }
  }

  getDuration() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.onloadedmetadata = () => {
        if (
          !isNaN(this.audioPlayer.nativeElement.duration) &&
          typeof this.audioPlayer.nativeElement.duration === 'number'
        ) {
          return this.timeFormat(this.audioPlayer.nativeElement.duration);
        }
      };
      return this.audioPlayer.nativeElement.onloadedmetadata();
    }
  }

  getCurrentTime() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.ontimeupdate = () => {
        this.songProgress =
          (this.audioPlayer.nativeElement.currentTime * 100) /
          this.audioPlayer.nativeElement.duration;
        this.songCurrentTime = this.timeFormat(
          this.audioPlayer.nativeElement.currentTime
        );
        if (
          this.audioPlayer.nativeElement.currentTime ===
          this.audioPlayer.nativeElement.duration
        ) {
          const temp = Object.keys(this.playBackMode).filter(
            (key) => this.playBackMode[key]
          );
          if (!temp?.length) {
            this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
          } else {
            if (temp[0] === 'repeatOne') {
              this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
              this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
            }
          }
        }
      };
    }
  }

  timeFormat(time: number) {
    return (
      Math.floor(time / 60) +
      ':' +
      (Math.floor(time % 60) < 10
        ? '0' + Math.floor(time % 60)
        : Math.floor(time % 60))
    );
  }

  getCurrentPlayingGenre() {
    this.genresService.currentPlayingGenre$.subscribe((data) => {
      this.currentPlayingGenre = data;
    });
  }

  setPlayBackMode(type: string) {
    if (type === 'repeatOne') {
      this.playBackMode.repeatOne = this.playBackMode.repeatOne ? false : true;
      this.playBackMode.shuffle = false;
    } else if (type === 'shuffle') {
      this.playBackMode.shuffle = this.playBackMode.shuffle ? false : true;
      this.playBackMode.repeatOne = false;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
