using io=System.IO;
using System.Linq;
using System.Web.Mvc;
using MiPrimerAppWebSocket.Models;
using MiPrimerAppWebSocket.ViewModels;
using System;
using System.Collections.Generic;

namespace MiPrimerAppWebSocket.Controllers
{
    public class SeccionController : Controller
    {
        // GET: Seccion
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult recuperarVideo(int id)
        {
            try
            {
                using(var db = new BDCursoEntities())
                {
                    Videossecciones objVideo = new Videossecciones();
                    objVideo = (from video in db.VideosSeccion
                             where video.BHABILITADO == 1 && video.IIDVIDEOS==id
                             select new Videossecciones 
                             {
                                NOMBRE=video.NOMBRE
                             }).First();
                    return Json(objVideo, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPost]
        public int guardarSeccionVideo(Videossecciones obj)
        {
            int result = 0;
            try
            {
                using(var db = new BDCursoEntities())
                {
                    string video = obj.VIDEO;
                    string caracter = video.Substring(0, 1);
                    if (obj.IIDVIDEOS == 0)
                    {
                        if (caracter.Equals("i"))
                        {
                            VideosSeccion videosSeccion = new VideosSeccion();
                            videosSeccion.NOMBRE = obj.NOMBRE;
                            videosSeccion.IIDSECCION = obj.IIDSECCION;
                            videosSeccion.BHABILITADO = 1;
                            if (obj.VIDEO == "i")
                                videosSeccion.VIDEO = "";
                            else
                                videosSeccion.VIDEO = obj.VIDEO.Substring(1);
                            db.VideosSeccion.Add(videosSeccion);
                            db.SaveChanges();
                            result= videosSeccion.IIDVIDEOS;
                        }
                    }
                    else
                    {
                        if (caracter.Equals("i"))
                        {
                            VideosSeccion videosSeccion = db.VideosSeccion.Where(p => p.IIDVIDEOS == obj.IIDVIDEOS).FirstOrDefault();
                            videosSeccion.NOMBRE = obj.NOMBRE;
                            if (obj.VIDEO != "i") { videosSeccion.VIDEO = obj.VIDEO.Substring(1); }
                            db.SaveChanges();
                            result = videosSeccion.IIDVIDEOS;
                        }
                        else 
                        {
                            VideosSeccion videosSeccion = db.VideosSeccion.Where(p => p.IIDVIDEOS == obj.IIDVIDEOS).FirstOrDefault();
                            videosSeccion.VIDEO += obj.VIDEO.Substring(1);
                            db.SaveChanges();
                            result = videosSeccion.IIDVIDEOS;
                        }
                    }
                }
            }
            catch (Exception)
            {
                result= 0;
            }
            return result;
        }

        [HttpGet]
        public string obtenerVideo(int Id)
        {
            using(var db = new BDCursoEntities())
            {
                var video = db.VideosSeccion.Where(p => p.IIDVIDEOS == Id).First().VIDEO;
                return video;
            }
        }
        [HttpGet]
        public JsonResult listarSeccionVideo(int Id)
        {
            List<Videossecciones> lst = new List<Videossecciones>();
            using(var db = new BDCursoEntities())
            {
                lst = (from seccion in db.SeccionCurso
                       join seccionvideo in db.VideosSeccion
                       on seccion.IIDSECCION equals seccionvideo.IIDSECCION
                       where seccion.IIDCURSO == Id && seccionvideo.BHABILITADO == 1 
                       && seccion.BHABILITADO == 1
                       select new Videossecciones
                       {
                           IIDVIDEOS = seccionvideo.IIDVIDEOS,
                           IIDSECCION = (int)seccionvideo.IIDSECCION,
                           NOMBRE = seccionvideo.NOMBRE
                       }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
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
        [HttpGet]
        public string obtenerNombre(int id)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    return db.Curso.Where(p => p.IIDCURSO == id).First().NOMBRE;
                }
            }
            catch (Exception e)
            {
                return "Error: " + e.Message;
            }
        }
        [HttpGet]
        public int eliminarVideo(int id)
        {
            try
            {
                using (var db = new BDCursoEntities())
                {
                    var data = db.VideosSeccion.Where(p => p.IIDVIDEOS == id).First();
                    db.VideosSeccion.Remove(data);
                    db.SaveChanges();
                }
                return 1;
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}