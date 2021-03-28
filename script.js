var axiosConfig = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }
}

function login() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    axios.post("http://localhost:45678/auth", { email: email, password: password }).then(res => {
        var token = res.data.token;
        localStorage.setItem("token", token);
        axiosConfig.headers.Authorization = "Bearer " + localStorage.getItem("token");
        document.getElementById("message-welcome").appendChild(document.createTextNode("Bem-vindo!"));
        document.getElementById("home-link").hidden = false;
    }).catch(err => {
        console.log(err);
    });
}

function createGame() {
    var game = {
        title: document.getElementById("title").value,
        year: document.getElementById("year").value,
        price: document.getElementById("price").value
    }
    axios.post("http://localhost:45678/game", game, axiosConfig).then(response => {
        if (response.status == 201) {
            var message = document.createTextNode(`${game.title} cadastrado com sucesso.`);
            var p = document.createElement("p");
            p.appendChild(message);
            p.setAttribute("id", "aviso");
            var form = document.getElementById("form-register");
            form.appendChild(p);
            setTimeout(function () {
                form.removeChild(p);
                form.reset();
            }, 2000);
        }
    }).catch(err => {
        console.log(err);
    });
}

function editGame() {
    var idGame = document.getElementById("id-game").value;
    var game = {
        title: document.getElementById("edit-title").value,
        year: document.getElementById("edit-year").value,
        price: document.getElementById("edit-price").value
    }
    axios.put("http://localhost:45678/game/" + idGame, game, axiosConfig).then(response => {
        if (response.status == 200) {
            var message = document.createTextNode(`${game.title} alterado com sucesso.`);
            var p = document.createElement("p");
            p.appendChild(message);
            p.setAttribute("id", "avisoEditado");
            var form = document.getElementById("form-edit");
            form.appendChild(p);
            setTimeout(function () {
                form.removeChild(p);
                form.reset();
            }, 2000);
        }
    }).catch(err => {
        console.log(err);
    });
}

function deleteGame(listItem) {
    var id = listItem.getAttribute("data-id");
    axios.delete("http://localhost:45678/game/" + id, axiosConfig).then(response => {
        alert("game deletado!");
    }).catch(err => {
        console.log("erro");
    });
}

function loadForm(listItem) {
    var id = listItem.getAttribute("data-id");
    axios.get("http://localhost:45678/game/" + id, axiosConfig).then(response => {
        var game = response.data;
        document.getElementById("id-game").value = game.id;
        document.getElementById("edit-title").value = game.title;
        document.getElementById("edit-year").value = game.year;
        document.getElementById("edit-price").value = game.price;
    }).catch(err => {
        console.log("erro");
    });
}

function refreshGameList() {
    axios.get("http://localhost:45678/games", axiosConfig).then(response => {
        var games = response.data;
        var list = document.getElementById("games");
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
        games.forEach(game => {
            var item = document.createElement("tr");
            item.setAttribute("data-id", game.id);
            var textTitle = document.createTextNode(game.title);
            var textYear = document.createTextNode(game.year);
            var textPrice = document.createTextNode(game.price);
            var textEditBtn = document.createTextNode("editar");
            var textDeleteBtn = document.createTextNode("deletar");
            var titleCell = document.createElement("td");
            var yearCell = document.createElement("td");
            var priceCell = document.createElement("td");
            var editCell = document.createElement("td");
            var deleteCell = document.createElement("td");
            var editBtn = document.createElement("button");
            var deleteBtn = document.createElement("button");
            editBtn.appendChild(textEditBtn);
            deleteBtn.appendChild(textDeleteBtn);
            deleteBtn.addEventListener("click", function () {
                deleteGame(item);
            });
            editBtn.addEventListener("click", function () {
                loadForm(item);
            });

            titleCell.appendChild(textTitle);
            yearCell.appendChild(textYear);
            priceCell.appendChild(textPrice);
            editCell.appendChild(editBtn);
            deleteCell.appendChild(deleteBtn);

            item.appendChild(titleCell);
            item.appendChild(yearCell);
            item.appendChild(priceCell);
            item.appendChild(editCell);
            item.appendChild(deleteCell);

            list.appendChild(item);

        });

    }).catch(error => {
        console.log(error);
    });
}