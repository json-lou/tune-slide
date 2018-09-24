import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistConfigComponent } from './playlist-config.component';

describe('PlistFormOneComponent', () => {
  let component: PlaylistConfigComponent;
  let fixture: ComponentFixture<PlaylistConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
