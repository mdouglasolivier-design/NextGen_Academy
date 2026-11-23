import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RequireEnrolled, RequireStudent } from '@/components/layout/RouteGuards';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import CourseDetail from '@/pages/CourseDetail';
import { Checkout, ForgotPassword, Login, Register, ResetPassword } from '@/pages/Auth';
import Dashboard from '@/pages/dashboard/Dashboard';
import Learn from '@/pages/dashboard/Learn';
import Quiz from '@/pages/dashboard/Quiz';
import { CertificateList, CertificateView, VerifyCertificate } from '@/pages/dashboard/Certificates';
import About from '@/pages/static/About';
import Contact from '@/pages/static/Contact';
import Programs from '@/pages/static/Programs';
import Resources from '@/pages/static/Resources';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Catalog />} />
        <Route path="courses/:id" element={<CourseDetail />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="checkout/:id" element={<Checkout />} />

        <Route element={<RequireStudent />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="learn/:id" element={<RequireEnrolled />}>
          <Route index element={<Learn />} />
        </Route>
        <Route path="quiz/:id" element={<RequireEnrolled />}>
          <Route index element={<Quiz />} />
        </Route>

        <Route path="certificates" element={<CertificateList />} />
        <Route path="certificates/:id" element={<CertificateView />} />
        <Route path="verify" element={<VerifyCertificate />} />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="programs" element={<Programs />} />
        <Route path="resources/:slug" element={<Resources />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}