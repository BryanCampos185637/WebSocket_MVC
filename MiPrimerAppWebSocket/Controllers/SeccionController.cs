using io=System.IO;
using System.Linq;
using System.Web.Mvc;
using MiPrimerAppWebSocket.Models;
using MiPrimerAppWebSocket.ViewModels;
using System;

namespace MiPrimerAppWebSocket.Controllers
{
    public class SeccionController : Controller
    {
        // GET: Seccion
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SeccionAgregar(int? Id)
        {
            if (Id != null)
            {
                ViewBag.Curso = Id;
                return View();
            }
            else
            {
                return Redirect("Index");
            }
        }
        [HttpGet]
        public JsonResult listarSeccion()
        {
            string foto = obtenerImagen();
            using (var db = new BDCursoEntities())
            {
                var lst = (from curso in db.Curso
                           join categoria in db.CategoriaCurso
                           on curso.IIDCATEGORIACURSO equals categoria.IIDCATEGORIACURSO
                           where curso.BHABILITADO == 1
                           select new Cursos
                           {
                               IIDCURSO = curso.IIDCURSO,
                               NOMBRE = curso.NOMBRE,
                               NOMBRECATEGORIA = categoria.NOMBRE,
                               IMAGEN = (curso.IMAGEN == null || curso.IMAGEN.Length < 100) ? foto : curso.IMAGEN
                           }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }
        private string obtenerImagen()
        {
            var rutaSinFoto = Server.MapPath("~/img/smile.jpg");
            byte[] foto = io.File.ReadAllBytes(rutaSinFoto);
            string base64 = "data:image/jpg;base64," + Convert.ToBase64String(foto);
            return base64;
        }
        [HttpGet]
        public JsonResult listar(int id)
        {
            using(var db = new BDCursoEntities())
            {
                var lst = (from seccion in db.SeccionCurso
                           where seccion.BHABILITADO == 1
                           && seccion.IIDCURSO == id
                           select new Secciones
                           {
                               IIDSECCION = seccion.IIDSECCION,
                               NOMBRESECCION = seccion.NOMBRESECCION,
                               DESCRIPCIONSECCION = seccion.DESCRIPCIONSECCION
                           }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public int eliminar(int id)
        {
            try
            {
                using(var db = new BDCursoEntities())
                {
                    var data = db.SeccionCurso.Where(p => p.IIDSECCION == id).First();
                    data.BHABILITADO = 0;
                    db.SaveChanges();
                }
                return 1;
            }
            catch (Exception)
            {
                return 0;
            }
        }
        [HttpGet]
        public JsonResult obtenerPorId(int Id)
        {
            try
            {
                using(var db = new BDCursoEntities())
                {
                    var Seccion = (from seccion in db.SeccionCurso
                                   where seccion.BHABILITADO == 1
                                   && seccion.IIDSECCION == Id
                                   select new Secciones
                                   {
                                       IIDSECCION = seccion.IIDSECCION,
                                       NOMBRESECCION = seccion.NOMBRESECCION,
                                       DESCRIPCIONSECCION = seccion.DESCRIPCIONSECCION
                                   }).First();
                    return Json(Seccion, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(null);
            }
        }
        [HttpPost]
        public int Guardar(Secciones secciones)
        {
            try
            {
                using(var db = new BDCursoEntities())
                {
                    if (secciones.IIDSECCION == 0)
                    {
                        SeccionCurso seccionCurso = new SeccionCurso();
                        seccionCurso.IIDCURSO = secciones.IIDCURSO;
                        seccionCurso.NOMBRESECCION = secciones.NOMBRESECCION;
                        seccionCurso.DESCRIPCIONSECCION = secciones.DESCRIPCIONSECCION;
                        seccionCurso.BHABILITADO = 1;
                        db.SeccionCurso.Add(seccionCurso);
                        db.SaveChanges();
                    }
                    else
                    {
                        var seccionCurso = db.SeccionCurso.Where(p => p.IIDSECCION.Equals(secciones.IIDSECCION)).First();
                        seccionCurso.NOMBRESECCION = secciones.NOMBRESECCION;
                        seccionCurso.DESCRIPCIONSECCION = secciones.DESCRIPCIONSECCION;
                        db.SaveChanges();
                    }
                    return 1;
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}