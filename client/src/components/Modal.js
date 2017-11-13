import React, {Component} from 'react';
import {connect} from 'react-redux'
import {toggleModal, addCollection} from '../redux/actions'
import axios from 'axios'

class Modal extends Component{
    constructor(){
        super();
        this.state = {
            collectionName: '',
            type: 'String',
            default : '',
            index: false,
            fieldName: '',
            fields: [],
            error: '',
            loading: false
        };
    }

    _addField () {
        let def = this.state.default, fields = this.state.fields 
        let present = this.state.fields.filter((field)=> this.state.fieldName === field.name).length !== 0
        if(this.state.type ==='Number' && (!isNaN(parseFloat(this.state.default)) || !present)){
            def = parseFloat(this.state.default)
            this.setState({
                fields: [...fields,{
                    type: this.state.type,
                    default: def,
                    index: this.state.index,
                    name: this.state.fieldName
                }],
                error: ''
            })
        } else {
            if(this.state.type === 'Number' && isNaN((parseFloat(this.state.default))) ){
                this.setState({error: "You can only use a number as a default value"})
            }
            else {
                if(!present){
                    this.setState({
                        fields: [...fields,{
                            type: this.state.type,
                            default: def.length===0?'---':def,
                            index: this.state.index,
                            name: this.state.fieldName
                        }],
                        error: ''
                    })
                } else {
                    this.setState({error: 'There is already a similar named field present'})
                }
               
            }
            
        }
    }

    _deleteField(fieldName){
        let fields = this.state.fields.filter((field)=> field.name !== fieldName)
        this.setState({fields})
    }

    _editField(fieldName){
        let field = this.state.fields.filter((field)=> field.name === fieldName)[0]
        this.setState({
            type: field.type,
            default: field.default,
            index: false,
            fieldName
        })
        this._deleteField(fieldName)        
    }

    _createSchema(){
        this.setState({loading: true})
        let schema = {}
        this.state.fields.forEach(field=>{
            schema[field.name] = { type: field.type }
            if(field.index===true) schema[field.name].index = field.index
            if(field.default!=='---') schema[field.name].default = field.default
        })
        let body = {
            collectionName: this.state.collectionName,
            schemaType: schema
        }
        axios.post('http://localhost:8000/newcollection', body)
          .then((res) =>{
              this.setState({loading: false})
              this.props.addCollection(this.state.collectionName)
              this.props.toggleModal(false)
          })
          .catch((err) => console.log(err))
    }

    render(){
        return this.props.modal?(
                <div style={styles.container}>
                    <div style={styles.clickable} onClick={()=>this.props.toggleModal(false)}></div>
                    <div style={styles.modal} onClick={()=>this.props.toggleModal(true)}>
                        <h1>Add a new Collection</h1>
                        <div>
                            Name of the new collection : <input 
                                type="text" 
                                onChange={(e)=>this.setState({collectionName: e.target.value})}
                                value={this.state.collectionName}/>                            
                        </div>
                        <h3>Fields for <span style={{color:'red'}}>{this.state.collectionName}</span> collection:</h3>
                        <div style={styles.fields}>
                            <ul style={{listStyleType:'none', padding:0, maxHeight: '250px', overflowY:'scroll'}}>
                                {
                                    this.state.fields.map((field,i)=>(
                                        <li key={i} style={{justifyContent: 'space-between', display:'flex'}}>
                                            <a>Field Name: <b>{field.name}</b></a> 
                                            <a>Field Type: <b>{field.type}</b></a> 
                                            <a>Indexing: <b>{String(field.index)}</b></a>
                                            <a>Default Value: <b>{field.default}</b></a> 
                                            <a><button onClick={()=>this._editField(field.name)}>Edit</button></a>
                                            <a><button onClick={()=>this._deleteField(field.name)}>Delete</button></a>
                                        </li>
                                    ))
                                }
                                <hr/>
                                <li style={{justifyContent: 'space-around', display:'flex', backgroundColor: '#ffd34b'}}>
                                    <a>
                                        <b>Field Name: </b>
                                        <input type="text"
                                                onChange={(e)=>this.setState({fieldName:e.target.value})}
                                                value={this.state.fieldName}/>
                                    </a>
                                    <a>
                                        <b>Field Type: </b>
                                        <select onChange={(e)=>this.setState({type:e.target.value})}
                                                value={this.state.type}>
                                            <option>String</option>
                                            <option>Number</option>
                                            <option>Date</option>
                                        </select>
                                    </a>
                                    <a>
                                    {
                                        this.state.type==='Number'?(<span><b>Auto-Indexing?: </b>
                                            <input type="checkbox" 
                                                checked={this.state.index}
                                                onChange={()=>this.setState({index: !this.state.index})}/>
                                            </span>):null
                                    }
                                    </a>
                                    <a>
                                        <b>Default Value: </b>
                                        <input
                                        disabled={this.state.type.length===0}
                                        type="text" 
                                        value={this.state.default} 
                                        onChange={(e)=>this.setState({default:e.target.value})} 
                                        />
                                    </a>
                                </li>
                                <li style={{display:'flex', justifyContent: 'center'}}>
                                    <button onClick={()=>this._addField()}>Add field</button>
                                </li>
                                <p style={{color:'red'}}>{this.state.error}</p>
                                <hr/>
                            </ul>
                        </div>
                        <p>
                            <button onClick={()=>this._createSchema()}>
                                Create <a style={{color:'red'}}>{this.state.collectionName}</a> Schema
                            </button>
                        </p>
                        {this.state.loading?(<p>Loading...</p>):null}
                    </div>
                </div>
            ):null       
    }
}

const styles = {
    container: {
        zIndex: 1,
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(196,196,196,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    clickable: {
        position: 'fixed',
        zIndex: 2,
        height: '100vh',
        width: '100vw',
      
    },
    modal: {
        zIndex: 10,
        width: '90vw',
        height: '90vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    fields: {
       backgroundColor: '#fff3c7',
       display: 'flex',
       flexDirection: 'column',
       padding: '15px',
       width: '90%',
       borderRadius: '10px'
    }
}

const mapStateToProps = (state) => ({
    modal: state.modal
})

const mapDispatchToProps = (dispatch) => ({
    toggleModal: (display) => dispatch(toggleModal(display)),
    addCollection: (collection) => dispatch(addCollection(collection)) 

})

export default connect(mapStateToProps, mapDispatchToProps)(Modal)