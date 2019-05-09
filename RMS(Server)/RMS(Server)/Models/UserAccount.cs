namespace RMS_Server_.Models
{
    public class UserAccount
    {
        public string Id { get; set; }  
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string AddingDateTime { get; set; }
        public string RoleName { get; set; }
    }
}