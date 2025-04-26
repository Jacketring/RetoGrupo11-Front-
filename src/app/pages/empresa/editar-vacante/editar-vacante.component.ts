import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VacanteService } from '../../../services/vacante.service';
import { CategoriaService } from '../../../services/categoria.service';
import { VacanteRequestDto } from '../../../interfaces/vacante-request-dto';

@Component({
  selector: 'app-editar-vacante',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-vacante.component.html',
  styleUrl: './editar-vacante.component.css',
  standalone: true
})
export class EditarVacanteComponent {
  form!: FormGroup;
  loading = false;
  categorias: any[] = [];
  idVacante!: number;

  private fb = inject(FormBuilder);
  private vacanteService = inject(VacanteService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.idVacante = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      salario: [0, Validators.required],
      detalles: ['', Validators.required],
      imagen: ['', Validators.required],
      nombreCategoria: ['', Validators.required],
    });

    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (err) => console.error('Error cargando categorías:', err)
    });

    this.vacanteService.getDetalle(this.idVacante).subscribe({
      next: (vacante) => {
        this.form.patchValue({
          nombre: vacante.nombre,
          descripcion: vacante.descripcion,
          salario: vacante.salario,
          detalles: vacante.detalles,
          imagen: vacante.imagen,
          nombreCategoria: vacante.categoria,
        });
      },
      error: (err) => console.error('Error cargando vacante:', err)
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const vacanteData: VacanteRequestDto = {
      ...this.form.value,
      fecha: new Date().toISOString().split('T')[0] // Actualizamos fecha
    };

    this.vacanteService.editarVacante(this.idVacante, vacanteData).subscribe({
      next: () => {
        alert('Vacante actualizada correctamente');
        this.router.navigate(['/empresa/mis-vacantes']);
      },
      error: (err) => {
        console.error('Error al actualizar vacante:', err);
        alert('Error al actualizar vacante');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
