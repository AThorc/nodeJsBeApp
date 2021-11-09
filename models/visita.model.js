module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        luogo: String,
        data_avvio: Date,
        data_scadenza: Date,
        userid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Visita = mongoose.model("visita", schema);
    return Visita;
  };