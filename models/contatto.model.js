module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        clienteid:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },
        dataContatto: Date,
        tipoContatto: String,
        note: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Contatto = mongoose.model("contatto", schema);
    return Contatto;
  };