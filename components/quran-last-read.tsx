import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const QuranLastRead = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 container shadow-none rounded-none md:rounded-3xl overflow-hidden mt-8">
      <CardHeader className="px-4 pt-4 pb-0 md:px-6 md:pt-6">
        <CardTitle className="text-2xl md:text-3xl font-extrabold text-white">
          Bacaan Qur'an
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="font-bold mb-2">Terakhir dibaca:</div>
        <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-lg">
          <div className="text-lg text-gray-300">Al Maidah Ayat 54</div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-1 px-4 rounded-full text-sm">
            Lanjut
          </Button>
        </div>
        <div className="font-bold mb-2">Surat pilihan:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { name: "Al-Fatihah", verses: "7 ayat" },
            { name: "Al-Kahf", verses: "110 ayat" },
            { name: "Al-Mulk", verses: "30 ayat" },
            { name: "Yasin", verses: "83 ayat" },
            { name: "Al-Waqi'ah", verses: "96 ayat" },
            { name: "Ar-Rahman", verses: "78 ayat" },
          ].map((surah, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <div>
                <span className="text-white font-semibold">{surah.name}</span>
                <span className="text-gray-400 text-sm ml-2">
                  ({surah.verses})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300"
              >
                Baca
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuranLastRead;
