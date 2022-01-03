module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        clienteid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },
        partnerid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Partner"
        },
        segnalatoreid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Segnalatore"
        },
        tipo: String,
        servizioid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Servizio"
        },
        fatturatoPartner: Number,
        fatturatoSocieta: Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Legame = mongoose.model("legame", schema);
    return Legame;
  };