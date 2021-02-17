using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace MiPrimerAppWebSocket.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string obtenerIpServer()
        {
            IPAddress[] IpLocal = Dns.GetHostAddresses(Dns.GetHostName());
            string ipServidorWebSocket = "ws://" + Convert.ToString(IpLocal[1]) + ":9898";//definimos la ip del equipo server
            return ipServidorWebSocket;
        }
    }
}