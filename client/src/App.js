import React, { Component } from 'react';
import {Provider} from 'react-redux'
import store from './redux/store'
import {connect} from 'react-redux'
import {toggleModal, addCollection, deleteCollection} from './redux/actions'
import Modal from './components/Modal'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allCollections: [],
      currentColl: null,
      currentSchema: {},
      entries: [],
      newEntry: {}
    }
  }

  componentWillMount(){
    axios
    .get('http://localhost:8000/allcollections')
    .then((res) => {
      res.data.forEach(col=>this.props.addCollection(col))
    })
    .catch(err=>console.log(err))
  }

  _deleteCollection(collectionName){
    axios
    .post('http://localhost:8000/deletecollection', {collectionName})
    .then((res)=>  this.props.deleteCollection(collectionName))
    .catch(err => console.log(err))
  }

  _changeCollection (collectionName) {
    axios.get(`http://localhost:8000/schemas/${collectionName}`)
    .then(res=>{
      this.setState({
        currentColl: collectionName, 
        currentSchema: JSON.parse(res.data[0].schemaType)
      })
    }).catch(err=>console.log(err))    

    axios.get(`http://localhost:8000/admin/${collectionName}`)
    .then(res=>{
      let entries = res.data.entries.map(entry=>{
        let keys = Object.keys(entry).filter(key => {return key !=="__v" && key !== "_id"})
        let newEntry = {}
        for(let x=0;x<keys.length;x++) newEntry[keys[x]] = entry[keys[x]]
        return newEntry 
      })
      this.setState({entries})
    })
    .catch(err=>console.log(err))
  }

  _addEntry () {
    let {currentColl, newEntry} = this.state

    console.log(newEntry)
    axios.post('http://localhost:8000/admin/add', {
      collection : currentColl,
      entry: newEntry
    })
    .then(res=>this.setState({newEntry:{}}))
    .catch(err=>console.log(err))
  }

  _deleteEntry (key, value) {
   let query = {}; query[key] = value;
    axios.post('http://localhost:8000/delete', {
      collection: this.state.currentColl,
      query
    })
    .then(res=>this.setState({entries: res.data.entries}))
    .catch(err=>console.log(err))
  }

  render() {
    return (
      <div>
          <Modal/>
          <h1 style={{backgroundColor: '#ffd34b', margin:0, height: '10vh'}}>The One-in-All MongoDB/TingoDB based Database editor</h1>
          <div style={{display:'flex', width:'100%', height: '90vh'}}>
            <div style={{flexDirection:'column', display: 'flex', flex: 1, backgroundColor: '#ececec', alignItems: 'center'}}>
              <h4>All Collections:</h4>            
                <ul style={{margin:0, listStyleType:'none' ,padding:0}}>
                  {
                    this.props.collections.map((col, key) => (
                      <li key={key}>
                        <button style={{backgroundColor: 'white'}} onClick={()=>this._changeCollection(col)}>
                          <b>{col}</b>
                        </button>&nbsp;
                        <button onClick={()=>this._deleteCollection(col)}>Delete</button>
                        <hr/>
                      </li>
                    ))
                  }
                </ul>
              <button style={{marginTop:'10vh'}} onClick={()=>this.props.toggleModal(true)}>+ Add New Collection</button>
            </div>
            <div style={{flexDirection:'column', display:'flex', flex: 4.5, backgroundColor: '#d9fdff'}}>
                {
                  !this.state.currentColl ? 
                  (<h1>Use the left Navigation to create a new Collection</h1>) :
                  ( <table style={{width:'100%', border: 'solid 1px black', borderCollapse: 'collapse'}}>
                    <tbody>
                        <tr>
                          {
                            Object.keys(this.state.currentSchema).map((entry,i)=>(
                              <th key={i} style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}>
                                {entry}
                              </th>
                            ))
                          }
                          <th style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}></th>
                        </tr>                          
                      
                        {
                          this.state.entries.map((entry,k)=>(
                            <tr key={k}>
                              {
                                Object.keys(entry).map((col,l)=>(
                                  <td key={l} style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}>
                                    {entry[col]}
                                  </td>
                                ))
                              }
                              <td style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}>
                                <button onClick={()=>this._deleteEntry(Object.keys(entry)[0], entry[Object.keys(entry)[0]])}>Delete Entry</button>
                              </td>
                            </tr>
                          ))
                        }
                        <tr> 
                            {
                                Object.keys(this.state.currentSchema).map((field, j)=>
                                (
                                  <td key={j} style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}>
                                    <hr/>
                                    <input 
                                    type="text"
                                    onChange={(e)=>{
                                        let newEntry = this.state.newEntry
                                        newEntry[field] = e.target.value
                                        return this.setState({ newEntry })
                                      }
                                      }/>
                                  </td>
                                ))
                            }
                            <td style={{textAlign:'center', border: '1px solid black', borderCollapse: 'collapse'}}>
                              <hr/>
                              <button onClick={(e)=>this._addEntry(this.state.currentColl, this.state.newEntry)}>
                                Add new Entry
                              </button>
                            </td>
                        </tr>
                      </tbody>
                    </table> 
                  )
                }
            </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  collections: state.collections
})

const mapDispatchToProps = (dispatch) => ({
  toggleModal: (display) => dispatch(toggleModal(display)),
  addCollection: (col) => dispatch(addCollection(col)),
  deleteCollection: (col) => dispatch(deleteCollection(col))
})
const FinalApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default () => (
  <Provider store={store}>
    <FinalApp/>
  </Provider>
)

