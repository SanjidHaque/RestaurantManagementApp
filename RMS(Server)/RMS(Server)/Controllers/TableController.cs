using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;
using RMS_Server_.Services;

namespace RMS_Server_.Controllers
{
    public class TableController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly StatusTextService _statusTextService;

        private TableController()
        {
            _context = new ApplicationDbContext();
            _statusTextService = new StatusTextService();
        }

        [HttpGet]
        [Route("api/GetTable/{tableId}")]
        public IHttpActionResult GetTable(int tableId)
        {
            Table table = _context.Tables.FirstOrDefault(x => x.Id == tableId);

            List<Order> orders = _context.Orders
                .Where(x => x.TableId == tableId)
                .ToList();

            List<OrderSession> orderSessions = _context.OrderSessions
                .Where(x => x.Order.Table.Id == tableId)
                .ToList();

            List<OrderedItem> orderedItems = _context.OrderedItems
                .Where(x => x.OrderSession.Order.Table.Id == tableId)
                .ToList();
            return Ok(table);
        }


        [HttpGet]
        [Route("api/GetAllTable")]
        public IHttpActionResult GetAllTable()
        {
            List<Table> tables = _context.Tables.
                OrderByDescending(x => x.Id).
                ToList();

            List<Order> orders = _context.Orders.Include(x => x.Table).
                ToList();

            List<OrderSession> orderSessions = _context.OrderSessions.Include(c => c.Order).
                ToList();

            List<OrderedItem> orderedItems = _context.OrderedItems.Include(c => c.OrderSession).
                ToList();

            return Ok(tables);
        }

        [HttpPost]
        [Route("api/AddNewTable")]
        public IHttpActionResult AddNewTable(Table table)
        {
            if (table != null)
            {
                if (_context.Tables.Any(o => o.Name == table.Name))
                {
                    return Ok(new { StatusText = _statusTextService.DuplicateItemName });
                }
                _context.Tables.Add(table);
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.SomethingWentWrong });
        }

        [HttpPut]
        [Route("api/EditTable")]
        public IHttpActionResult EditTable(Table table)
        {
            Table getTable = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (getTable != null)
            {
                if (_context.Tables.Any(o => o.Name == table.Name && o.Name != getTable.Name))
                {
                    return Ok(new { StatusText = _statusTextService.DuplicateItemName });
                }

                getTable.Name = table.Name;
                _context.Entry(getTable).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }

        [HttpDelete]
        [Route("api/DeleteTable/{tableId}")]
        public IHttpActionResult DeleteTable(int tableId)
        {
            Table deleteTable = _context.Tables.Include(x => x.Orders).FirstOrDefault(p => p.Id == tableId);
            if (deleteTable == null)
            {
                return Ok(new { StatusText = _statusTextService.ResourceNotFound });
            }
            
            if (deleteTable.Orders.Count != 0)
            {
                return Ok(new { StatusText = _statusTextService.ReportingPurposeIssue });
            }
           
            _context.Tables.Remove(deleteTable);
            _context.SaveChanges();
            return Ok();

        }


        [HttpPut]
        [Route("api/ChangeTableState")]
        public IHttpActionResult ChangeTableState(Table table)
        {
            Table getTable = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (getTable != null)
            {
                getTable.CurrentState = table.CurrentState;
                _context.Entry(getTable).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }
    }
}
