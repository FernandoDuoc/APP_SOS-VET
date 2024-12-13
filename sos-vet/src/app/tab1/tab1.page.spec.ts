import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsService } from '../services/maps.service';
import { Tab1Page } from './tab1.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Tab1Page],
      providers: [MapsService]
    }).compileComponents();
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
