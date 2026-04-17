"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion"; 
import { 
  Loader2, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  MessageSquare 
} from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FooterWithSitemap from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function ContactPage() {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Simple input validation helper
  const isValid = () => {
    return contact.name.trim() && contact.email.includes("@") && contact.message.trim();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValid()) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    try {
      // Kept your exact API structure
      const response = await axios.post(`/api/contact/`, contact);

      if (response.data) {
        toast.success("Your message has been sent successfully!");
        setContact({ name: "", email: "", message: "" }); // Reset form
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Decorative Background Elements (2025 Trend: Soft Gradients) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <main className="flex-1 py-12 md:py-24">
        <motion.div 
          className="container px-4 md:px-6 mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have a question about our products or need technical support? 
              Our team is ready to help you build something amazing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Contact Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-8">
                  
                  {/* Info Item 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-muted-foreground mt-1">
                        1234 Innovation Blvd<br />
                        Tech City, TC 56789
                      </p>
                    </div>
                  </div>

                  {/* Info Item 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Call Us</h3>
                      <p className="text-muted-foreground mt-1">
                        Mon-Fri from 8am to 5pm
                      </p>
                      <a href="tel:+11234567890" className="text-foreground hover:text-primary transition-colors font-medium">
                        (123) 456-7890
                      </a>
                    </div>
                  </div>

                  {/* Info Item 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-muted-foreground mt-1">
                        Speak to our friendly team.
                      </p>
                      <Link href="mailto:info@shoplentic.com" className="text-foreground hover:text-primary transition-colors font-medium">
                        info@shoplentic.com
                      </Link>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div variants={itemVariants}>
              <Card className="backdrop-blur-sm bg-card/80 border shadow-lg relative overflow-hidden">
                {/* Top border accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> 
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    We usually respond within 24 hours.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={contact.name}
                          onChange={(e) => setContact({ ...contact, name: e.target.value })}
                          className="bg-background/50 focus:bg-background transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          className="bg-background/50 focus:bg-background transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">How can we help?</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project or inquiry..."
                        value={contact.message}
                        onChange={(e) => setContact({ ...contact, message: e.target.value })}
                        className="min-h-[150px] bg-background/50 focus:bg-background transition-all resize-none"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full md:w-auto md:float-right min-w-[140px]" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <FooterWithSitemap />
    </div>
  );
}