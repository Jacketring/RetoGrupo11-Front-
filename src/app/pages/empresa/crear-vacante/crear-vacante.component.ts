import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VacanteService } from '../../../services/vacante.service';
import { CategoriaService } from '../../../services/categoria.service';
import { VacanteRequestDto } from '../../../interfaces/vacante-request-dto';

@Component({
  selector: 'app-crear-vacante',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-vacante.component.html',
  styleUrl: './crear-vacante.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearVacanteComponent {
  form!: FormGroup;
  categorias: any[] = [];
  loading = false;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private vacanteService = inject(VacanteService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      salario: [0, Validators.required],
      detalles: ['', Validators.required],
      imagen: ['', Validators.required],
      destacado: [false],
      nombreCategoria: ['', Validators.required], 
    });

    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const vacanteData: VacanteRequestDto = {
      ...this.form.value,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.vacanteService.crearVacante(vacanteData).subscribe({
      next: (res) => {
        alert(res.message || 'Vacante creada correctamente');
        this.router.navigate(['/empresa/mis-vacantes']);
      },
      error: (err) => {
        console.error('Error al crear vacante:', err);
        alert(err.error?.message || 'Error al crear vacante');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
