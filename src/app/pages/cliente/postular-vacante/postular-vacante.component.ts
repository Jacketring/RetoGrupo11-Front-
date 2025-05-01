import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudService } from '../../../services/solicitud.service';
import { SolicitudRequestDto } from '../../../interfaces/solicitud-request-dto';
import { UsuarioService } from '../../../services/usuario.service';
import { VacanteService } from '../../../services/vacante.service';

@Component({
  selector: 'app-postular-vacante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './postular-vacante.component.html',
  styleUrl: './postular-vacante.component.css'
})
export class PostularVacanteComponent implements OnInit {
  form!: FormGroup;
  idVacante!: number;
  loading = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitudService = inject(SolicitudService);
  private usuarioService = inject(UsuarioService);
  private vacanteService = inject(VacanteService);

  ngOnInit(): void {
    this.idVacante = Number(this.route.snapshot.paramMap.get('idVacante'));
    
    this.form = this.fb.group({
      archivo: ['', Validators.required],
      curriculum: ['', Validators.required],
      comentarios: [''],
      nombreVacante: [{ value: '', disabled: true }, Validators.required],
    });
    // Obtener nombre de la vacante desde el backend
    this.vacanteService.getDetalle(this.idVacante).subscribe({
      next: (vacante) => {
        this.form.patchValue({ nombreVacante: vacante.nombre });
      },
      error: (err) => {
        console.error('Error al obtener vacante:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const solicitud: SolicitudRequestDto = {
      ...this.form.getRawValue()
    };

    this.usuarioService.postularVacante(this.idVacante, solicitud).subscribe({
      next: (res) => {
        alert(res || '✅ Postulación enviada correctamente');
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('❌ Error al postular:', err);
        alert(err.error || 'Ocurrió un error al postular');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
