
     "use client";
 import api from "../lib/axios";
 import { DataGrid } from "devextreme-react";
 import "devextreme/dist/css/dx.light.css";
 import CustomStore from "devextreme/data/custom_store";
 import { useEffect, useState } from "react";
 import { Column, Lookup, RequiredRule } from "devextreme-react/data-grid";
 
 export default function Home() {
   const [store, setStore] = useState<CustomStore>(new CustomStore());
   const [lookupSource, setLookupSource] = useState<CustomStore>(
     new CustomStore()
   );
   const [selectedButton, setSelectedButton] = useState<string>("companies");
 
   useEffect(() => {
     // Define the lookupTable based on the selectedButton
     const lookupTable =
       selectedButton === "professionals" ? "companies" : "professionals";
 
     setStore(
       new CustomStore({
         key: "id",
         async load(loadOptions) {
           const { data } = await api.get("/" + selectedButton);
           return data;
         },
         async insert(values) {
           await api.post("/" + selectedButton, values);
         },
         async update(key, values) {
           await api.put("/" + selectedButton + "/" + key, values);
         },
         async remove(key) {
           await api.delete("/" + selectedButton + "/" + key);
         },
       })
     );
 
     setLookupSource(
       new CustomStore({
         key: "id",
         async load(loadOptions) {
           const { data } = await api.get("/" + lookupTable); // Use lookupTable here
           return data;
         },
         async byKey(key, extraOptions) {
           const { data } = await api.get("/" + lookupTable + "/" + key); // Use lookupTable here
           return data;
         },
       })
     );
   }, [selectedButton]);
 
   return (
     <div
       style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
     >
       <div
         style={{
           flex: "0.1",
           display: "flex",
           justifyContent: "center",
           gap: 30,
         }}
       >
         <button onClick={() => setSelectedButton("professionals")}>
           Professionals
         </button>
         <button onClick={() => setSelectedButton("companies")}>
           Companies
         </button>
         <button onClick={() => setSelectedButton("products")}>Products</button>
       </div>
       <DataGrid
         dataSource={store}
         editing={{
           allowAdding: true,
           allowUpdating: true,
           allowDeleting: true,
         }}
       >
         <Column dataField="name">
           <RequiredRule />
         </Column>
         {(selectedButton === "professionals" ||
           selectedButton === "products") && (
           <Column
             dataType="number"
             dataField={
               selectedButton === "professionals"
                 ? "companyId"
                 : "professionalId"
             }
             caption={
               selectedButton === "professionals" ? "Company" : "Professional"
             }
           >
             <RequiredRule />
             <Lookup
               dataSource={lookupSource}
               displayExpr={"name"}
               valueExpr={"id"}
             />
           </Column>
         )}
       </DataGrid>
     </div>
   );
 }
 
   