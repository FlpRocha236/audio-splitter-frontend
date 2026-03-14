import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stems } from './stems';

describe('Stems', () => {
  let component: Stems;
  let fixture: ComponentFixture<Stems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stems],
    }).compileComponents();

    fixture = TestBed.createComponent(Stems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
