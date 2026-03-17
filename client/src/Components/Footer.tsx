import { Compass } from "lucide-react"
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom"
import { Facebook, Twitter } from "lucide-react"

export function Footer () {
    return (
        <footer id="contact" className="bg-slate-900 text-white py-12">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-6 w-6 text-orange-400" />
                <span className="text-xl font-bold">Wonder Weave</span>
              </div>
              <p className="text-slate-400 mb-4">
                Crafting unforgettable journeys across the vibrant tapestry of India.
              </p>
              <div className="flex space-x-4">
                <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  to="#"
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="#destinations" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="#features" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#about" className="text-slate-400 hover:text-orange-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#contact" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Popular Destinations</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Rajasthan
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Kerala
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Goa
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Ladakh
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Varanasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-slate-400">
                <p>Indore</p>
                <p>Madhya Pradesh, India</p>
                <p className="mt-2">tanmayyadav1410@gmail.com</p>
                <p>+91 6267931593</p>
              </address>
            </div>
          </div>

          <div className=" border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Wonder Weave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}