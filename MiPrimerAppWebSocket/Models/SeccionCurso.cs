//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MiPrimerAppWebSocket.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SeccionCurso
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SeccionCurso()
        {
            this.VideosSeccion = new HashSet<VideosSeccion>();
        }
    
        public int IIDSECCION { get; set; }
        public string NOMBRESECCION { get; set; }
        public Nullable<int> IIDCURSO { get; set; }
        public string DESCRIPCIONSECCION { get; set; }
        public Nullable<int> BHABILITADO { get; set; }
    
        public virtual Curso Curso { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VideosSeccion> VideosSeccion { get; set; }
    }
}
