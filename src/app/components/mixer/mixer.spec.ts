import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mixer } from './mixer';

describe('Mixer', () => {
  let component: Mixer;
  let fixture: ComponentFixture<Mixer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mixer],
    }).compileComponents();

    fixture = TestBed.createComponent(Mixer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
