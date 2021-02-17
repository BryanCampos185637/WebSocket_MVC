using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MiPrimerAppWebSocket.Models;
using MiPrimerAppWebSocket.ViewModels;

namespace MiPrimerAppWebSocket.Controllers
{
    public class CursoController : Controller
    {
        // GET: Curso
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Nuevo()
        {
            return View();
        }
        public ActionResult Editar(Int64? Id)
        {
            if (Id == null)
                return Redirect("Index");
            else
            {
                ViewBag.Curso = Id;
                return View();
            }
        }

        public ActionResult Grafico()
        {
            return View();
        }
        [HttpGet]
        public JsonResult Obtenercurso(int Id)
        {
            using (var db = new BDCursoEntities())
            {
                var data = (from curso in db.Curso
                            join categoria in db.CategoriaCurso
                            on curso.IIDCATEGORIACURSO equals categoria.IIDCATEGORIACURSO
                            where curso.IIDCURSO == Id
                            select new Cursos
                            {
                                IIDCURSO = curso.IIDCURSO,
                                NOMBRE = curso.NOMBRE,
                                DESCRIPCION = curso.DESCRIPCION,
                                IIDCATEGORIACURSO = categoria.IIDCATEGORIACURSO,
                                PRECIO = curso.PRECIO,
                                CUPON = curso.CUPON,
                                IMAGEN = curso.IMAGEN
                            }).First();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult listarCursos(int? id)
        {
            using(var db = new BDCursoEntities())
            {
                if (id == null)
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
                                   PRECIO = curso.PRECIO
                               }).ToList();
                    return Json(lst, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var lst = (from curso in db.Curso
                               join categoria in db.CategoriaCurso
                               on curso.IIDCATEGORIACURSO equals categoria.IIDCATEGORIACURSO
                               where curso.BHABILITADO == 1 && curso.IIDCATEGORIACURSO == id
                               select new Cursos
                               {
                                   IIDCURSO = curso.IIDCURSO,
                                   NOMBRE = curso.NOMBRE,
                                   NOMBRECATEGORIA = categoria.NOMBRE,
                                   PRECIO = curso.PRECIO
                               }).ToList();
                    return Json(lst, JsonRequestBehavior.AllowGet);
                }
            }
        }
        [HttpGet]
        public int eliminarCurso(int id)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    Curso curso = db.Curso.Where(p => p.IIDCURSO == id).First();
                    curso.BHABILITADO = 0;
                    db.SaveChanges();return 1;
                }
            }
            catch (System.Exception)
            {
                return 0;
            }
        }
        [HttpPost]
        public int guardarDatos(Cursos obj)
        {
            try
            {
                using(var db = new BDCursoEntities())
                {
                    if (obj.IIDCURSO == 0)
                    {
                        Curso curso = new Curso();
                        curso.IMAGEN = obj.IMAGEN;
                        curso.IIDCATEGORIACURSO = obj.IIDCATEGORIACURSO;
                        curso.NOMBRE = obj.NOMBRE;
                        curso.PRECIO = obj.PRECIO;
                        curso.DESCRIPCION = obj.DESCRIPCION;
                        curso.CUPON = obj.CUPON;
                        curso.BHABILITADO = 1;
                        db.Curso.Add(curso);
                        db.SaveChanges();
                    }
                    else
                    {
                        Curso curso = db.Curso.Where(p => p.IIDCURSO == obj.IIDCURSO).First();
                        curso.IMAGEN = obj.IMAGEN;
                        curso.IIDCATEGORIACURSO = obj.IIDCATEGORIACURSO;
                        curso.NOMBRE = obj.NOMBRE;
                        curso.PRECIO = obj.PRECIO;
                        curso.DESCRIPCION = obj.DESCRIPCION;
                        curso.CUPON = obj.CUPON;
                        db.SaveChanges();
                    }
                }
                return 1;
            }
            catch (System.Exception)
            {
                return 0;
            }
        }
        [HttpGet]
        public JsonResult listarDatosReporteGrafico()
        {
            using (var db = new BDCursoEntities())
            {
                List<Categoriacursos> lst = new List<Categoriacursos>();
                lst = (from curso in db.Curso
                       join categoria in db.CategoriaCurso on
                       curso.IIDCATEGORIACURSO equals categoria.IIDCATEGORIACURSO
                       where curso.BHABILITADO == 1
                       group categoria by categoria.NOMBRE into valor
                       select new Categoriacursos
                       {
                           NOMBRE = valor.Key,
                           CANTIDAD = valor.Count()
                       }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }
    }
}