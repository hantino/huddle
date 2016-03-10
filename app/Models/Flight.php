<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    public function conference()
    {
        return $this->belongsTo('App\Models\Conference');
    }

    public function passengers()
    {
        return $this->belongsToMany('App\Models\Profile', 'profile_takes_flights');
    }
}
