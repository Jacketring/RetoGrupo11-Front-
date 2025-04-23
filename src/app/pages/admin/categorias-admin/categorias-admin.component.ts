import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoriaDto } from '../../../interfaces/categoria-dto';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-categorias-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias-admin.component.html',
  styleUrl: './categorias-admin.component.css',
  standalone: true,
})
export class CategoriasAdminComponent {

  categorias: CategoriaDto[] = [];
  error: string | null = null;

  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.error = 'No se pudieron cargar las categorías.';
      }
    });
  }

  eliminar(id: number) {
    const confirmado = confirm('¿Eliminar esta categoría?');
    if (confirmado) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.categoriaService.getCategorias().subscribe({
            next: (data) => {
              this.categorias = data;
              this.cd.markForCheck();
            },
            error: (err) => {
              console.error('Error actualizando la lista de categorías', err);
            }
          });
          alert('Categoría eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          if (err.status === 409) {
            alert('❌ No se puede eliminar esta categoría porque está en uso.');
          } else {
            alert('Error al eliminar la categoría.');
          }
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/admin/categorias/editar', id]);
  }

  crear() {
    this.router.navigate(['/admin/categorias/crear']);
  }
}
