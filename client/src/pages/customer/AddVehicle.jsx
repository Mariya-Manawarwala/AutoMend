import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Car, ChevronLeft } from "lucide-react";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    color: "",
    fuelType: "Petrol",
    mileage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Adding vehicle:", formData);
    navigate("/vehicles");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate("/vehicles")}
          className="p-2 bg-soft rounded-full hover:bg-border-soft transition-colors text-text-primary"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Add New Vehicle</h1>
          <p className="text-text-secondary text-sm mt-1">Register a new vehicle to your account</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-soft">
          <div className="w-12 h-12 bg-brand-light text-brand-deep rounded-xl flex items-center justify-center">
            <Car size={24} />
          </div>
          <div>
            <h2 className="font-bold text-text-primary">Vehicle Information</h2>
            <p className="text-sm text-text-secondary">Enter the details of your vehicle</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Make" 
              name="make"
              placeholder="e.g. Toyota" 
              value={formData.make}
              onChange={handleChange}
              required
            />
            <Input 
              label="Model" 
              name="model"
              placeholder="e.g. Fortuner" 
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Year" 
              name="year"
              type="number"
              placeholder="e.g. 2022" 
              value={formData.year}
              onChange={handleChange}
              required
            />
            <Input 
              label="License Plate" 
              name="licensePlate"
              placeholder="e.g. MH-01-AB-1234" 
              value={formData.licensePlate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Color" 
              name="color"
              placeholder="e.g. White" 
              value={formData.color}
              onChange={handleChange}
              required
            />
            <Input 
              label="Mileage (km)" 
              name="mileage"
              type="number"
              placeholder="e.g. 45000" 
              value={formData.mileage}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">Fuel Type</label>
              <select 
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full bg-soft border border-border-soft rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                required
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-border-soft flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/dashboard/vehicles")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Save Vehicle
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
