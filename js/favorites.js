import { GitHubUsers } from "./github-user.js";

// classe que vai conter a lógica dos dados
//como os dados serao organizados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

    load() {
      this.entries = JSON.parse(localStorage.getItem
        ('@github-favorites2:')) || []

        
    }

    save() {
      localStorage.setItem("@github-favorites2:", JSON.stringify(this.entries));
    }

    async add(username) {
      try {

        const userExists = this.entries.find(entry => entry.login === username)

        if(userExists) {
          throw new Error('Este usuário já foi encontrado')
        }


        const user = await GitHubUsers.search(username)


        if(user.login === undefined) {
          throw new Error("Este usuário não foi encontrado!")
        }


        this.entries = [user, ...this.entries]
        this.update()
        this.save()

      } catch(error) {
        alert(error.message)
      }

    }

    delete(user) {
      const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)


        this.entries = filteredEntries
        this.update()
        this.save()
      }

    }



// classe que vai criara  visualizaçao e eventos do html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
    

    this.entries.forEach((user) => {
      const row = this.CreateRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;

      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm(
          "Tem certeza que deseja desfavoritar este usuário?"
        );

        if (isOk) {
          this.delete(user);
        }
      };
      
      this.toggleHaveFavorite();
      this.tbody.append(row);
    });
  }

  CreateRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
                    <td class="user">
                        <img src="http://github.com/maykbrito.png" alt="imagem maykbrito">
                        <a href="https://github.com/maykbrito" target="_blank">
                            <p>Mayk Brito</p>
                            <span>maykbrito</span>
                        </a>
                    </td>
                    <td class="repositories">76</td>
                    <td class="followers">9589</td>
                    <td class="remove">Remover</td>
        
        `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }


  toggleHaveFavorite() {
     const noneHaveFavoriteDiv = this.root.querySelector('.noneHaveFavorites')
     if (this.entries.length === 0) {
      noneHaveFavoriteDiv.classList.remove("hide");
     } else {
       noneHaveFavoriteDiv.classList.add("hide");
     }
 }
}
