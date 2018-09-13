import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Playlist } from 'src/app/shared/models/playlist.model';
import { SliderComponent } from '../../shared/components/slider/slider.component';

@Component({
  selector: 'app-playlist-config',
  templateUrl: './playlist-config.component.html',
  styleUrls: ['./playlist-config.component.scss']
})
export class PlaylistConfigComponent implements OnInit {
  @ViewChild('length') length: SliderComponent;
  @ViewChild('content') content: SliderComponent;
  @ViewChild('privacy') privacy: SliderComponent;
  @ViewChild('acousticness') acousticness: SliderComponent;
  @ViewChild('danceability') danceability: SliderComponent;
  @ViewChild('instrumentalness') instrumentalness: SliderComponent;
  @ViewChild('tempo') tempo: SliderComponent;
  @ViewChild('valence') valence: SliderComponent;

  playlistGroup: FormGroup;

  playlistName: FormControl;
  playlistDescription: FormControl;

  constructor() {
    this.playlistName = new FormControl('');
    this.playlistDescription = new FormControl('');
    this.playlistGroup = new FormGroup({
      playlistName: this.playlistName,
      playlistDescription: this.playlistDescription,
    });
  }

  ngOnInit() {
  }

  booleanFilter(value: number): boolean {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(): Playlist {
    const playlistConfig = {
      name: this.playlistName.value,
      description: this.playlistDescription.value,
      playlistSettings: {
        length: this.length.value,
        content: this.booleanFilter(this.content.value),
        privacy: this.booleanFilter(this.privacy.value),
      },
      trackSettings: {
        acousticness: this.acousticness.value,
        danceability: this.danceability.value,
        instrumentalness: this.instrumentalness.value,
        tempo: this.tempo.value,
        valence: this.valence.value,
      }
    };
    if (playlistConfig.name !== '' && playlistConfig.playlistSettings.length !== 0) {
      console.log(playlistConfig);
      return playlistConfig;
    } else {
      return null;
    }
  }

}
