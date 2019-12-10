import React, { Component } from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
class ImageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserId: "-1",
            currentAlbumId: "-1",
            ImageList: [],
            AlbumList: []
        }
    }
    selectUser = (event) => {
        this.setState({currentUserId: event.target.value});
        if (event.target.value !== "-1") {
            console.log(event.target.value);
            this.fetchAlbums(event.target.value);
        } else {
            this.setState({ ImageList: [], AlbumList: [] });
        }
    }
    fetchAlbums = async (id) => {
        const response = await fetch("https://jsonplaceholder.typicode.com/albums?userId=" + id);
        const json = await response.json();
        const albums = json.map((item) => ({id: item.id, titel: item.title}));
        albums.unshift({ id: -1, titel: "Kies album" });
        console.log(albums);
        this.setState({AlbumList : albums});
    }
    selectAlbum = (event) => {
        this.setState({currentAlbumId: event.target.value});
        if (event.target.value !== "-1") {
            this.fetchImages(event.target.value);
        } else {
            this.setState({ ImageList: [] });
        }
    }

    
    fetchImages = async (id) => {
        const response = await fetch("https://jsonplaceholder.typicode.com/photos?albumId=" + id);
        const json = await response.json();
        const photos = json.map((item) => ({ id: item.id, titel:item.title, thumbnailUrl: item.thumbnailUrl }))

        this.setState({ ImageList: photos });
    }

    render() {
        return (
            <React.Fragment>
                <select onChange={this.selectUser} value={this.state.currentUserId}>
                    {this.props.users.map(user => (<option key={user.id} value={user.id}>{user.naam}</option>))}
                </select>
                {console.log("userid: ", this.state.currentUserId)}
                {this.state.currentUserId != "-1" ?(<div>
                    <select onChange={this.selectAlbum} value={this.state.currentAlbumId}>
                        {this.state.AlbumList.map(album => (<option key={album.id} value={album.id}>{album.titel}</option>))}
                    </select>
                </div>):""}
                <ul>
                    {this.state.ImageList.map((item) => (<img key={item.id} alt={item.titel} src={item.thumbnailUrl} />))}
                </ul>
            </React.Fragment>
        )
    }

}
class TodosContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserId: -1,
            TodoList: []
        }
    }
    selectUser = (event) => {
        if (event.target.value !== "-1") {
            console.log(event.target.value);
            this.fetchTodos(event.target.value);
        } else {
            this.setState({ TodoList: [] });
        }
    }
    fetchTodos = async (id) => {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos?userId=" + id);
        const json = await response.json();
        console.log(json);
        const todos = json.map((item) => ({ id: item.id, titel: item.title }))

        this.setState({ TodoList: todos })
    }
    render() {
        return (
            <React.Fragment>
                <select onChange={this.selectUser}>
                    {this.props.users.map(user => (<option key={user.id} value={user.id}>{user.naam}</option>))}
                </select>
                <ul>
                    {this.state.TodoList.map((item) => (<li key={item.id}>{item.titel}</li>))}
                </ul>
            </React.Fragment>


        )
    }
}
class TypeCodeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [] }
    }
    async componentDidMount() {
        const response = await fetch('http://jsonplaceholder.typicode.com/users');
        const json = await response.json();
        const users = json.map(item => ({ id: item.id, naam: item.name }));
        users.unshift({ id: -1, naam: "Kies user" });
        this.setState({ users: users });
        console.log(users);

    }
    render() {
        return (
            <HashRouter>
                <nav>
                    <NavLink exact to="/">Todos</NavLink>
                    <NavLink exact to="/fotos">Foto's</NavLink>
                </nav>
                <div>
                    <Route exact path="/">
                        <TodosContainer users={this.state.users} />
                    </Route>
                    <Route path="/fotos">
                        <ImageContainer users={this.state.users} />
                    </Route>
                </div>
            </HashRouter>

        )
    }
}
export default TypeCodeContainer;