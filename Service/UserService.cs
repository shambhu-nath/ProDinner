using System.Linq;
using Omu.Encrypto;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.Core.Service;

namespace Omu.ProDinner.Service
{
    public class UserService : CrudService<User>, IUserService
    {
        private readonly IHasher hasher;

        public UserService(IRepo<User> repo, IHasher hasher)
            : base(repo)
        {
            this.hasher = hasher;
            hasher.SaltSize = 10;
        }

        public override int Create(User user)
        {
            user.Password = hasher.Encrypt(user.Password);
            return base.Create(user);
        }

        public bool IsUnique(string login)
        {
            return !repo.GetAll(true).Any(o => o.Login == login);
        }

        public User Get(string login, string password)
        {
            var user = repo.GetAll().FirstOrDefault(o => o.Login == login);
            if (user == null || !hasher.CompareStringToHash(password, user.Password)) return null;
            return user;
        }

        public void ChangePassword(int id, string password)
        {
            repo.Get(id).Password = hasher.Encrypt(password);
            repo.Save();
        }
    }
}