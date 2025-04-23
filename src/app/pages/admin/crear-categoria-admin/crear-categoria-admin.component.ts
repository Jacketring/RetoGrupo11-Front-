import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { Router, RouterModule } from '@angular/router';
import { CategoriaDto } from '../../../interfaces/categoria-dto';

@Component({
  selector: 'app-crear-categoria-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-categoria-admin.component.html',
  styleUrl: './crear-categoria-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearCategoriaAdminComponent {

  form!: FormGroup;
  loading = false;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const categoria: CategoriaDto = this.form.value;

    this.categoriaService.createCategoria(categoria).subscribe({
      next: () => {
        alert('Categoría creada correctamente');
        this.router.navigate(['/admin/categorias']);
      },
      error: (err) => {
        this.error = 'No se pudo crear la categoría.';
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
