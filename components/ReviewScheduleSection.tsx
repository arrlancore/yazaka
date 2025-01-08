import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ReviewSchedule,
  PeerReview,
  PeerReviewSlotTime,
} from "@/types/hafalan";
import { useHafalanStore } from "@/lib/stores/hafalan-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface ReviewScheduleSectionProps {
  targetId: string;
  reviews: ReviewSchedule[];
}

const ReviewScheduleSection: React.FC<ReviewScheduleSectionProps> = ({
  targetId,
  reviews,
}) => {
  const { completeReview } = useHafalanStore();
  const [activeReviewForm, setActiveReviewForm] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<PeerReview>({
    date: new Date(),
    peerId: "",
    mistakes: "",
    feedback: "",
    mushafahah: false,
  });

  const handleNewReviewChange = (field: keyof PeerReview, value: any) => {
    setNewReview((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveReview = (reviewDate: Date) => {
    completeReview(targetId, reviewDate, { ...newReview, date: new Date() });
    setActiveReviewForm(null);
    setNewReview({
      date: new Date(),
      peerId: "",
      mistakes: "",
      feedback: "",
      mushafahah: false,
    });
  };
  // hide of no review schedule
  if (reviews.length === 0) return null;

  return (
    <>
      {reviews.map((review) => (
        <Card
          key={review.date.toISOString()}
          className="mb-6 p-4 border rounded-lg"
        >
          <div className="flex justify-between items-center gap-2">
            <h4 className="font-semibold mb-2">
              {review.date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h4>
            {review.completed ? (
              <Badge variant="outline" className="text-primary">
                Murajaah Lengkap
              </Badge>
            ) : (
              <Badge className="text-xs" variant="secondary">
                Perlu 3 kali Murajaah untuk lakukan
              </Badge>
            )}
          </div>
          <div className="space-y-4">
            {review.peerReviews && review.peerReviews.length > 0 ? (
              review.peerReviews.map((peerReview, index) => (
                <div key={index} className="mb-2 last:mb-0 pb-2 last:pb-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white font-semibold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <div className="col-span-2 sm:col-span-3 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Penguji
                      </p>
                      <p>{peerReview.peerId}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Waktu Review
                      </p>
                      <p>
                        {new Date(peerReview.date).toLocaleString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Waktu Slot
                      </p>
                      <p>{peerReview.slot ?? "-"}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Mushafahah
                      </p>
                      <p>{peerReview.mushafahah ? "Ya" : "Tidak"}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Kesalahan
                      </p>
                      <p>{peerReview.mistakes}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3 bg-muted p-3 rounded-md">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Feedback/Masukan
                      </p>
                      <p>{peerReview.feedback}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Belum ada review tersedia.</p>
            )}
            {activeReviewForm === review.date.toISOString() ? (
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Penguji"
                  value={newReview.peerId}
                  onChange={(e) =>
                    handleNewReviewChange("peerId", e.target.value)
                  }
                />
                <Input
                  placeholder="Kesalahan (pisahkan dengan koma)"
                  value={newReview.mistakes}
                  onChange={(e) =>
                    handleNewReviewChange("mistakes", e.target.value)
                  }
                />
                <Select
                  onValueChange={(value: PeerReviewSlotTime) =>
                    handleNewReviewChange("slot", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih waktu slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Pagi">Pagi</SelectItem>
                      <SelectItem value="Siang">Siang</SelectItem>
                      <SelectItem value="Malam">Malam</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Feedback/Masukan"
                  value={newReview.feedback}
                  onChange={(e) =>
                    handleNewReviewChange("feedback", e.target.value)
                  }
                />

                <div className="flex items-center">
                  <Checkbox
                    id={`mushafahah-${review.date.toISOString()}`}
                    checked={newReview.mushafahah}
                    onCheckedChange={(checked) =>
                      handleNewReviewChange("mushafahah", checked)
                    }
                  />
                  <label
                    className="ml-2"
                    htmlFor={`mushafahah-${review.date.toISOString()}`}
                  >
                    Mushafahah
                  </label>
                </div>
                <Button
                  onClick={() => handleSaveReview(review.date)}
                  className="w-full"
                >
                  Simpan Review
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setActiveReviewForm(review.date.toISOString())}
                className="mt-2"
              >
                Tambah Review
              </Button>
            )}
          </div>
        </Card>
      ))}
    </>
  );
};

export default ReviewScheduleSection;
