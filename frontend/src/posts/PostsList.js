import React, { Component } from 'react';
import {
    List,
    Datagrid,
    TextField,
} from 'react-admin';

const PostsList = ( props ) => {
    return (
        <List 
            {...props} 
            exporter={false}
            bulkActionButtons={false}        
            title="Posts List"
        >       
           <Datagrid
                {...props}                                
             >
                <TextField source="id" label="ID" sortable={false} />
                <TextField source="title" label="Title" sortable={false} />
                <TextField source="status" label="Status" sortable={false} />
            </Datagrid>
        </List>
    )
};

export default PostsList;

