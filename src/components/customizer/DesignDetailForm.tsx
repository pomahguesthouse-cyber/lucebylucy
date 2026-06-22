import { SelectablePill } from "@/components/ui/selectable-pill";
import {
  accents,
  cuttings,
  necklines,
  outfitLengths,
  sleeveLengths,
  sleeveModels,
} from "@/data/design-details";
import { useCustomizerStore } from "@/store/customizer-store";

interface FieldProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

function SingleSelectField({ label, options, value, onSelect }: FieldProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-charcoal">{label}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <SelectablePill
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onSelect(value === option ? "" : option)}
          />
        ))}
      </div>
    </div>
  );
}

export function DesignDetailForm() {
  const designDetails = useCustomizerStore((s) => s.designDetails);
  const setDesignDetails = useCustomizerStore((s) => s.setDesignDetails);

  const toggleAccent = (accent: string) => {
    const exists = designDetails.accents.includes(accent);
    const next = exists
      ? designDetails.accents.filter((a) => a !== accent)
      : [...designDetails.accents, accent];
    setDesignDetails({ accents: next });
  };

  return (
    <div className="space-y-7">
      <SingleSelectField
        label="Kerah (neckline)"
        options={necklines}
        value={designDetails.neckline}
        onSelect={(neckline) => setDesignDetails({ neckline })}
      />
      <SingleSelectField
        label="Panjang lengan"
        options={sleeveLengths}
        value={designDetails.sleeveLength}
        onSelect={(sleeveLength) => setDesignDetails({ sleeveLength })}
      />
      <SingleSelectField
        label="Model lengan"
        options={sleeveModels}
        value={designDetails.sleeveModel}
        onSelect={(sleeveModel) => setDesignDetails({ sleeveModel })}
      />
      <SingleSelectField
        label="Panjang baju"
        options={outfitLengths}
        value={designDetails.outfitLength}
        onSelect={(outfitLength) => setDesignDetails({ outfitLength })}
      />
      <SingleSelectField
        label="Cutting"
        options={cuttings}
        value={designDetails.cutting}
        onSelect={(cutting) => setDesignDetails({ cutting })}
      />
      <div>
        <h3 className="text-sm font-semibold text-charcoal">Aksen (bisa pilih lebih dari satu)</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {accents.map((accent) => (
            <SelectablePill
              key={accent}
              label={accent}
              selected={designDetails.accents.includes(accent)}
              onClick={() => toggleAccent(accent)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
