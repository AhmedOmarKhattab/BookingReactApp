import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Layout from "./Components/Layout/Layout";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import AddCategory from "./pages/Admin/Category/AddCategory";
import EventsIndex from "./pages/Admin/Events/EventsIndex";
import CreateEventForm from "./pages/Admin/Events/CreateEventForm";
import EditEventForm from "./pages/Admin/Events/EditEventForm";
import CategoriesIndex from "./pages/Admin/Category/CategoriesIndex";
import EditCategory from "./pages/Admin/Category/EditCategoryForm";
import EventDetails from "./pages/Home/Events/EventDetails";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/Account/ForgetPassword";
import ResetPassword from "./pages/Account/ResestPassword";
import BookingsIndex from "./pages/BookingIndex";



export default function App() {
  return (
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/event/create" element={<CreateEventForm />} />
          <Route path="/event/edit/:id" element={<EditEventForm />} />
          <Route path="/event/:id" element={<EventDetails />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/booking" element={<BookingsIndex />} />


          <Route path="/categories/create" element={<AddCategory />} />
          <Route path="/admin/events" element={<EventsIndex />} />
          <Route path="/admin/categories" element={<CategoriesIndex />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
          



          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
