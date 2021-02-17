using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MiPrimerAppWebSocket.Models;
using MiPrimerAppWebSocket.ViewModels;

namespace MiPrimerAppWebSocket.Controllers
{
    public class CategoriacursoController : Controller
    {
        // GET: Categoriacurso
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult obtenerCategoricurso(int Id)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    var categoriacursos = db.CategoriaCurso.Where(x => x.IIDCATEGORIACURSO == Id).Select(p => new Categoriacursos
                    {
                        IIDCATEGORIACURSO = p.IIDCATEGORIACURSO,
                        NOMBRE = p.NOMBRE
                    }).First();
                    return Json(categoriacursos, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpGet]
        public int EliminarCategoricurso(int Id)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    var categoriaCurso = db.CategoriaCurso.Where(x => x.IIDCATEGORIACURSO.Equals(Id)).FirstOrDefault();
                    categoriaCurso.HABILITADO = 0;
                    db.SaveChanges();
                    return 1;
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }
        [HttpGet]
        public JsonResult listarCategoriacurso(string nombreCategoria)
        {
            using(var db = new BDCursoEntities())
            {
                List<Categoriacursos> lst = new List<Categoriacursos>();
                if (nombreCategoria == null || nombreCategoria == "") 
                {
                    lst = db.CategoriaCurso.Where(x => x.HABILITADO == 1).Select(p => new Categoriacursos
                    {
                        IIDCATEGORIACURSO = p.IIDCATEGORIACURSO,
                        NOMBRE = p.NOMBRE
                    }).ToList();
                }
                else
                {
                    lst = db.CategoriaCurso.Where(x => x.HABILITADO == 1 && x.NOMBRE.Contains(nombreCategoria)).Select(p => new Categoriacursos
                    {
                        IIDCATEGORIACURSO = p.IIDCATEGORIACURSO,
                        NOMBRE = p.NOMBRE
                    }).ToList();
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int guardarDatos(Categoriacursos obj)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    if (obj.IIDCATEGORIACURSO == 0)
                    {
                        CategoriaCurso categoriaCurso = new CategoriaCurso();
                        categoriaCurso.NOMBRE = obj.NOMBRE;
                        categoriaCurso.HABILITADO = 1;
                        db.CategoriaCurso.Add(categoriaCurso);
                        db.SaveChanges();
                    }
                    else
                    {
                        CategoriaCurso categoriaCurso = db.CategoriaCurso.Where(p => p.IIDCATEGORIACURSO == obj.IIDCATEGORIACURSO).FirstOrDefault();
                        categoriaCurso.NOMBRE = obj.NOMBRE;
                        db.SaveChanges();
                    }

                    return 1;
                }
            }
            catch(Exception e) { return 0; }
        }

    }
}