import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReseniaComponent } from './ver-resenia.component';

describe('VerReseniaComponent', () => {
  let component: VerReseniaComponent;
  let fixture: ComponentFixture<VerReseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReseniaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
