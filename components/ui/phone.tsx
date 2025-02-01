import React, { useEffect, useState } from "react";
import { Input } from "./input";
import Image from "next/image";

interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (phoneNumber: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  name,
  required = false,
  autoFocus = false,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();

        const formattedCountries = data.map((country: any) => ({
          name: country.name.common,
          flag: country.flags?.svg || "",
          code: country.cca2,
          dialCode: country.idd?.root
            ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
            : "",
        }));

        setCountries(formattedCountries);

        const defaultCountry =
          formattedCountries.find((c: any) => c.code === "NG") ||
          formattedCountries[0];

        setSelectedCountry(defaultCountry);

        if (defaultCountry) {
          onChange(defaultCountry.dialCode);
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (code: string) => {
    const country = countries.find((c) => c.code === code);
    if (country) {
      setSelectedCountry(country);
      const currentNumber = value
        .replace(selectedCountry?.dialCode || "", "")
        .trim();
      onChange(country.dialCode + currentNumber);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedNumber = inputValue
      .replace(selectedCountry?.dialCode || "", "")
      .trim();
    onChange(selectedCountry?.dialCode + formattedNumber);
  };

  return (
    <div className="flex border rounded-lg overflow-hidden">
      <div className="flex items-center border-r px-3 cursor-pointer relative">
        {selectedCountry ? (
          <>
            <Image
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              width={20}
              height={15}
              className="mr-1"
            />
            <span className="text-sm">{selectedCountry.dialCode}</span>
          </>
        ) : (
          <>
            <Image
              src="/assets/svgs/nigeria.svg"
              alt="Nigeria flag"
              width={20}
              height={15}
              className="mr-1"
            />
            <span className="text-sm">+234</span>
          </>
        )}
        <select
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.dialCode})
            </option>
          ))}
        </select>
      </div>

      <Input
        type="tel"
        className="flex-1 px-2 focus:outline-none focus:ring-0"
        placeholder={placeholder}
        value={value?.replace(selectedCountry?.dialCode || "", "")}
        onChange={handleInputChange}
        name={name}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
};
