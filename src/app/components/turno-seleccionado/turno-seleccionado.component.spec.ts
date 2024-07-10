import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoSeleccionadoComponent } from './turno-seleccionado.component';

describe('TurnoSeleccionadoComponent', () => {
  let component: TurnoSeleccionadoComponent;
  let fixture: ComponentFixture<TurnoSeleccionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoSeleccionadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurnoSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
